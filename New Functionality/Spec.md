# Līguma izveide (Contract Creation System)
## Functional Specification - AD-58

### 1. Executive Summary

The Contract Creation System automates the generation of service agreements for residents in two care facilities: Adoro Melodija and Adoro Šampēteris. The system handles product selection, pricing calculation, document generation with dynamic field population, and contract lifecycle management (draft → final → amendments).

**Key Features:**
- Automatic product code selection based on care level, room type, residence, and term duration
- Two-phase workflow: Draft and Final states
- Support for two residence templates with different numbering schemes
- Chronological contract numbering
- Appendix/amendment generation
- 10% discount option

---

### 2. Business Context

#### 2.1 Current Process Problems
- Manual contract creation in Word requires significant time
- Risk of errors when manually filling contract fields
- No centralized tracking of contract versions and amendments
- Inconsistent product pricing application
- Missing audit trail for contract changes

#### 2.2 Solution Approach
Create a "fluid" contract system where:
- Contracts start as drafts (editable, incomplete fields allowed)
- Administrator completes required fields
- System auto-selects product code and price
- "Complete and Print" generates final document
- All data prepopulated from system to avoid manual Word editing

---

### 3. Contract Templates and Numbering

#### 3.1 Two Residence Templates

**Adoro Melodija (AM)**
- Contract number format: `AM-####/2026`
- Starting number: `AM-2988/2026`
- Template: Līgums_Adoro Melodija_2025.docx
- Standard appendixes: 2 (Services Description, Internal Rules)

**Adoro Šampēteris (AŠ)**
- Contract number format: `AŠ-####/2026`
- Starting number: `AŠ-0000/2026`
- Template: Līgums_Adoro Šampēteris_2025.docx
- Standard appendixes: 3 (Services + Rules + **Care Level Calculation**)

#### 3.2 Appendix/Amendment Numbering

Format: `{CONTRACT_NUMBER}-{APPENDIX_NUMBER}/{YEAR}`

Examples:
- First appendix: `AM-2988-1/2026`
- Second appendix: `AM-2988-2/2026`
- Price change amendment: `AM-2988-3/2026`

**Chronological Requirement:** Contract numbers must follow sequential order. Each new resident gets the next available number.

---

### 4. Terminology Mapping

**CRITICAL:** The contract uses different terminology than the system:

| Contract Term | System Term | Description |
|--------------|-------------|-------------|
| Klients | Rezidents | The person receiving care |
| Apgādnieks | Klients | The person paying/responsible |

This must be correctly mapped in all generated documents.

---

### 5. Product Code and Pricing Logic

#### 5.1 Product Code Determination

Product code is automatically selected based on 4 parameters:

1. **Aprūpes līmenis** (Care Level): GIR 1-6 from AGGIR assessment
2. **Istabas tips** (Room Type): 
   - 1-vietīga (single) - determined by room number
   - 2-vietīga (double) - determined by room number
3. **Rezidence** (Residence): Adoro Melodija or Adoro Šampēteris
4. **Termiņš** (Term Type): 
   - Ilgtermiņa (long-term: >3 months)
   - Īstermiņa (short-term: ≤3 months)

#### 5.2 Product Pricing Table

Each unique combination = one product with fixed price:

```
Product Code Format: {RESIDENCE}-{CARE_LEVEL}-{ROOM_TYPE}-{TERM}
Example: AM-GIR3-1V-ILG (Melodija, GIR 3, Single Room, Long-term)
```

**Product Master Table:**
```sql
CREATE TABLE produkti (
  id BIGINT PRIMARY KEY,
  kods VARCHAR(50) UNIQUE NOT NULL,
  nosaukums VARCHAR(255) NOT NULL,
  rezidence ENUM('melodija', 'šampēteris') NOT NULL,
  aprūpes_līmenis ENUM('GIR1','GIR2','GIR3','GIR4','GIR5','GIR6') NOT NULL,
  istabas_tips ENUM('1-vietīga', '2-vietīga') NOT NULL,
  termiņa_tips ENUM('ilgtermiņa', 'īstermiņa') NOT NULL,
  dienas_cena DECIMAL(10,2) NOT NULL,
  aktīvs BOOLEAN DEFAULT TRUE,
  derīgs_no DATE NOT NULL,
  derīgs_līdz DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  INDEX idx_aktīvie (aktīvs, derīgs_no, derīgs_līdz),
  INDEX idx_meklēšana (rezidence, aprūpes_līmenis, istabas_tips, termiņa_tips)
);
```

**Price History:**
- Products are versioned over time
- When price changes, create new product row with new `derīgs_no` date
- Old product gets `derīgs_līdz` date
- Contract always references specific product version

#### 5.3 Discount Application

**10% Discount Option:**
- Checkbox: "Piemērot 10% atlaidi"
- Applied to daily rate: `final_price = base_price * 0.9`
- Discount recorded in contract record
- Shown separately on invoice

---

### 6. Data Model

#### 6.1 Core Tables

```sql
CREATE TABLE līgumi (
  id BIGINT PRIMARY KEY,
  līguma_numurs VARCHAR(50) UNIQUE NOT NULL,
  
  -- Status
  statuss ENUM('melnraksts', 'aktīvs', 'pabeigts', 'anulēts') NOT NULL,
  
  -- Parties
  rezidenta_id BIGINT NOT NULL, -- Links to residents table
  klienta_id BIGINT, -- Can be NULL if "Rezidents pats būs klients"
  
  -- Date range
  sākuma_datums DATE NOT NULL,
  beigu_datums DATE,
  nav_beigu_datums BOOLEAN DEFAULT FALSE,
  
  -- Product & Pricing
  produkta_id BIGINT NOT NULL, -- Links to produkti table
  dienas_cena DECIMAL(10,2) NOT NULL, -- Stored at contract time
  atlaide_procenti DECIMAL(5,2) DEFAULT 0,
  dienas_cena_ar_atlaidi DECIMAL(10,2) NOT NULL,
  
  -- Room selection
  istabas_id BIGINT NOT NULL,
  
  -- Administrative
  piezīmes TEXT,
  izveidoja_id BIGINT NOT NULL,
  apstiprināja_id BIGINT,
  apstiprināšanas_datums TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (rezidenta_id) REFERENCES rezidenti(id),
  FOREIGN KEY (klienta_id) REFERENCES klienti(id),
  FOREIGN KEY (produkta_id) REFERENCES produkti(id),
  FOREIGN KEY (istabas_id) REFERENCES istabas(id),
  
  INDEX idx_statuss (statuss),
  INDEX idx_aktīvie (statuss, sākuma_datums, beigu_datums),
  INDEX idx_rezidents (rezidenta_id)
);
```

```sql
CREATE TABLE līgumu_pielikumi (
  id BIGINT PRIMARY KEY,
  līguma_id BIGINT NOT NULL,
  pielikuma_numurs VARCHAR(50) NOT NULL, -- e.g., "AM-2988-1/2026"
  tips ENUM('pakalpojumu_apraksts', 'iekšējie_noteikumi', 'aprūpes_līmenis', 'cenu_maiņa', 'cits') NOT NULL,
  nosaukums VARCHAR(255) NOT NULL,
  faila_ceļš VARCHAR(500),
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (līguma_id) REFERENCES līgumi(id) ON DELETE CASCADE,
  UNIQUE KEY unique_pielikums (līguma_id, pielikuma_numurs)
);
```

```sql
CREATE TABLE līgumu_izmaiņas (
  id BIGINT PRIMARY KEY,
  līguma_id BIGINT NOT NULL,
  izmaiņas_datums DATE NOT NULL,
  izmaiņas_tips ENUM('cena', 'aprūpes_līmenis', 'istaba', 'termiņš', 'cits') NOT NULL,
  vecā_vērtība TEXT,
  jaunā_vērtība TEXT,
  pamatojums TEXT,
  pielikuma_id BIGINT, -- Links to līgumu_pielikumi if amendment created
  
  izveidoja_id BIGINT NOT NULL,
  created_at TIMESTAMP,
  
  FOREIGN KEY (līguma_id) REFERENCES līgumi(id),
  FOREIGN KEY (pielikuma_id) REFERENCES līgumu_pielikumi(id),
  
  INDEX idx_līgums_datums (līguma_id, izmaiņas_datums)
);
```

#### 6.2 Supporting Tables

**Istabas (Rooms):**
```sql
CREATE TABLE istabas (
  id BIGINT PRIMARY KEY,
  numurs VARCHAR(20) NOT NULL,
  rezidence ENUM('melodija', 'šampēteris') NOT NULL,
  tips ENUM('1-vietīga', '2-vietīga', '3-vietīga') NOT NULL,
  stāvs INT,
  vietu_skaits INT NOT NULL,
  aktīvā BOOLEAN DEFAULT TRUE,
  
  UNIQUE KEY unique_istaba (rezidence, numurs),
  INDEX idx_aktīvās (aktīvā, rezidence, tips)
);
```

---

### 7. User Interface Flow

#### 7.1 Contract Creation Form

**Input Fields:**

1. **Līguma numurs** (Contract Number)
   - Required field
   - Free text input (administrator enters manually)
   - Format validation: `XX-####/YYYY`
   - Uniqueness check on save

2. **Līguma sākuma datums** (Start Date)
   - Required field
   - Date picker
   - Cannot be in the past

3. **Līguma beigu datums** (End Date)
   - Conditionally required (unless "Nav beigu datums" checked)
   - Date picker
   - Must be after start date

4. **Nav beigu datums** (No End Date)
   - Checkbox
   - When checked:
     - End date field becomes read-only
     - End date value cleared
     - Represents indefinite contract

5. **Rezidents** (Resident)
   - Required field
   - Auto-populated: Rezidenta Vārds / Uzvārds from resident record
   - Editable (overwrites original)
   - Maps to "Klients" in contract

6. **Klients** (Client/Caregiver)
   - Required field
   - Auto-populated: Klienta Vārds / Uzvārds from client record
   - Editable (overwrites original)
   - Maps to "Apgādnieks" in contract

7. **Rezidents pats būs klients** (Resident is their own client)
   - Checkbox
   - When checked: copies Resident name to Client field
   - Useful when resident pays for themselves

#### 7.2 Room Selection Interface

**Automatic Filters (from Administration → Basic Info):**

1. **Aprūpes līmenis** (Care Level)
   - Auto-loaded from resident's current care assessment
   - Dropdown: GIR1, GIR2, GIR3, GIR4, GIR5, GIR6
   - Manually changeable
   - Acts as filter for room search

2. **Rezidence** (Residence)
   - Auto-loaded if room already assigned
   - Dropdown: Adoro Melodija, Adoro Šampēteris
   - Manually changeable
   - Acts as filter for room search

3. **Istabas veids** (Room Type Filter)
   - Auto-loaded if room already assigned
   - Radio buttons: Viss / 1-vietīgs / 2-vietīgs
   - Manually changeable
   - Acts as filter for room search

**Room Selection:**
- Display available rooms matching filters
- Show room number, floor, occupancy status
- Radio button to select room
- If room already assigned in previous step, pre-select it

**Smart Pre-population:**
If resident already has room assignment from "Administration → Basic Info":
- All filter values auto-filled
- Selected room pre-highlighted
- Administrator can change if needed

#### 7.3 Pricing Display

**Dzīvošanas izmaksas** (Living Costs)
- Auto-calculated based on selected product
- Display: `€XX.XX / diennakts` (per day)
- Read-only (user cannot edit)
- Formula:
  ```
  base_price = produkti.dienas_cena (based on 4 parameters)
  
  IF discount_checkbox = TRUE THEN
    final_price = base_price * 0.9
  ELSE
    final_price = base_price
  END IF
  ```

**Piemērot 10% atlaidi** (Apply 10% Discount)
- Checkbox
- When checked: daily rate reduced by 10%
- Discount percentage stored in contract record

#### 7.4 Additional Fields

**Piezīmes** (Notes)
- Free text field
- For internal administrative use
- NOT included in generated contract document
- Visible only to administrators

#### 7.5 Action Buttons

User can perform three actions:

1. **Atcelt** (Cancel)
   - Discards new contract draft
   - Confirmation prompt if any data entered
   - Returns to contract list view

2. **Saglabāt kā Melnrakstu** (Save as Draft)
   - Saves contract with status = 'melnraksts'
   - Required fields may be empty
   - Allows administrator to return later
   - Draft can be edited indefinitely

3. **Saglabāt** (Save / Complete)
   - Validates all required fields filled
   - Changes status to 'aktīvs'
   - Contract ready for printing and signing
   - Creates contract number in sequence
   - Triggers document generation

---

### 8. Contract States and Workflow

#### 8.1 State Diagram

```
[NEW] → [MELNRAKSTS] → [AKTĪVS] → [PABEIGTS]
         ↓                ↓
      [ANULĒTS]      [ANULĒTS]
```

**State Definitions:**

1. **MELNRAKSTS** (Draft)
   - Editable
   - Required fields can be empty
   - Not legally binding
   - Can be deleted
   - No document generated yet

2. **AKTĪVS** (Active)
   - All required fields filled
   - Document generated and ready to print
   - Legally binding once signed
   - Limited editing (only certain fields)
   - Creates audit log on changes

3. **PABEIGTS** (Completed)
   - Contract term ended
   - Resident moved out
   - Read-only (historical record)
   - Cannot be edited

4. **ANULĒTS** (Cancelled)
   - Contract terminated prematurely
   - Reason recorded
   - Read-only
   - Kept for audit purposes

#### 8.2 State Transitions

**MELNRAKSTS → AKTĪVS:**
- Triggered by: "Saglabāt" button (Complete)
- Validation: All required fields filled
- Action: Generate contract document
- Result: Contract ready for printing

**AKTĪVS → PABEIGTS:**
- Triggered by: End date reached OR resident checkout
- Manual or automatic (scheduled job)
- Read-only historical record

**MELNRAKSTS → ANULĒTS:**
- Triggered by: Administrator action
- Reason required
- Draft discarded

**AKTĪVS → ANULĒTS:**
- Triggered by: Early termination
- Creates termination amendment
- Reason and date required

---

### 9. Document Generation

#### 9.1 Dynamic Field Population

The system must populate these fields in the contract template:

**From Contract Record:**
- Līguma numurs (Contract number)
- Līguma sākuma datums (Start date)
- Līguma beigu datums (End date) - or "uz nenoteiktu laiku" if no end date
- Dienas cena (Daily rate)
- Dienas cena ar atlaidi (Daily rate with discount)

**From Resident (maps to "Klients" in contract):**
- Vārds un uzvārds (Full name)
- Personas kods (Personal ID)
- Deklarētā adrese (Declared address)

**From Client (maps to "Apgādnieks" in contract):**
- Vārds un uzvārds (Full name)
- Personas kods (Personal ID)
- Deklarētā adrese (Declared address)

**From Room:**
- Istabas numurs (Room number)
- Istabas tips: ☑ vienvietīga / ☑ divvietīga (Room type checkbox)

**From Product:**
- Pakalpojuma veids: ☑ ilglaicīgs / ☑ īslaicīgs (Service type checkbox)

#### 9.2 Template Selection Logic

```php
if (rezidence == 'melodija') {
    template = 'Līgums_Adoro Melodija_2025.docx';
    appendixCount = 2;
} else if (rezidence == 'šampēteris') {
    template = 'Līgums_Adoro Šampēteris_2025.docx';
    appendixCount = 3; // Includes care level calculation
}
```

#### 9.3 Šampēteris Special Requirement

**3rd Appendix: Aprūpes līmeņa aprēķins (Care Level Calculation)**

Must include:
1. Text explanation of all care levels (GIR 1-6)
2. Resident's assigned care level
3. AGGIR assessment calculation details
4. Most recent assessment date
5. Assessor name

**Data Source:**
- Pull from resident's latest care assessment record
- Include AGGIR questionnaire responses
- Calculate GIR score breakdown
- Format as human-readable table

---

### 10. Appendix and Amendment System

#### 10.1 Appendix Types

**Standard Appendixes (created with contract):**

1. **Pakalpojumu apraksts** (Services Description)
   - Pielikums 1
   - Standard template
   - Same for all contracts

2. **Iekšējie noteikumi** (Internal Rules)
   - Pielikums 2
   - Standard template
   - Same for all contracts

3. **Aprūpes līmeņa aprēķins** (Care Level Calculation)
   - Pielikums 3
   - **Only for Adoro Šampēteris**
   - Dynamic content (resident-specific)

**Amendment Appendixes (created on contract change):**

4. **Cenu maiņa** (Price Change)
   - Created when daily rate changes
   - Includes: old price, new price, effective date, reason

5. **Aprūpes līmeņa maiņa** (Care Level Change)
   - Created when GIR level changes
   - Includes: old level, new level, reassessment date

6. **Istabas maiņa** (Room Change)
   - Created when room changes
   - Includes: old room, new room, move date, reason

7. **Cits** (Other Amendment)
   - Custom amendments
   - Free text content

#### 10.2 Amendment Creation Workflow

**Trigger Points:**
- Care level reassessment (GIR change)
- Annual price increase
- Room change for health reasons
- Municipality subsidy change

**Amendment Process:**
1. System detects change requiring amendment
2. Administrator reviews change
3. "Create Amendment" action
4. System generates new appendix document
5. Appendix number auto-incremented: `{CONTRACT}-{N+1}/YYYY`
6. Change recorded in `līgumu_izmaiņas` table
7. Both parties must sign amendment

---

### 11. Product Pricing Management

#### 11.1 Price Change Scenarios

**Annual Price Increase:**
- Typically occurs January 1st each year
- Affects all active contracts
- Requires amendment for each contract
- System can batch-generate amendments

**Individual Price Adjustment:**
- Care level change (GIR reassessment)
- Room type change (1-bed ↔ 2-bed)
- Term type change (short ↔ long)
- Triggers automatic product reselection

#### 11.2 Price History Tracking

When price changes:
1. Create new product record with new price
2. Set `derīgs_no` = effective date
3. Set old product `derīgs_līdz` = day before effective date
4. Existing contracts still reference old product (frozen price)
5. New contracts get new product (new price)

**Example:**
```sql
-- Old product
UPDATE produkti 
SET derīgs_līdz = '2025-12-31'
WHERE kods = 'AM-GIR3-1V-ILG' AND derīgs_līdz IS NULL;

-- New product
INSERT INTO produkti (kods, nosaukums, rezidence, aprūpes_līmenis, 
                      istabas_tips, termiņa_tips, dienas_cena, 
                      derīgs_no, aktīvs)
VALUES ('AM-GIR3-1V-ILG', 'Melodija GIR3 Single Long-term', 
        'melodija', 'GIR3', '1-vietīga', 'ilgtermiņa', 
        65.00, '2026-01-01', TRUE);
```

---

### 12. Integration Points

#### 12.1 Resident Management
- Pull resident personal data (name, ID, address)
- Link to current room assignment
- Link to latest care assessment (GIR level)

#### 12.2 Room Management
- Query available rooms
- Filter by residence, type, occupancy
- Update room occupancy on contract activation

#### 12.3 Care Assessment System
- Pull GIR level for product selection
- Pull AGGIR calculation for Šampēteris appendix
- Trigger amendment when reassessment changes GIR

#### 12.4 Invoicing System
- Contract provides daily rate
- Calculate monthly charges based on days in month
- Apply discount if specified
- Handle prorated charges for partial months

#### 12.5 Municipality Subsidy (AD-72)
- Contract net rate used for subsidy calculation
- Subsidy reduces resident's payment
- Changes trigger contract amendments

---

### 13. Validation Rules

#### 13.1 Required Field Validation

**For "Saglabāt kā Melnrakstu":**
- No validation required
- All fields optional

**For "Saglabāt" (Complete):**
- Līguma numurs: Required, unique, correct format
- Sākuma datums: Required, cannot be past
- Beigu datums: Required if "Nav beigu datums" unchecked
- Rezidents: Required
- Klients: Required
- Istaba: Required
- Product: Auto-selected, must exist

#### 13.2 Business Logic Validation

1. **Contract Number Uniqueness:**
   - Check against existing contracts
   - Enforce chronological order within year
   - Prevent gaps in sequence

2. **Date Range Validation:**
   - End date must be after start date
   - Cannot overlap with active contract for same resident
   - Start date cannot be more than 30 days in future

3. **Room Availability:**
   - Room cannot be occupied by another active contract
   - Exception: 2-bed room can have 2 active contracts

4. **Product Availability:**
   - Selected product must have valid price on contract start date
   - Product must be active (`aktīvs = TRUE`)

5. **Discount Validation:**
   - 10% discount only if administrator has permission
   - Log discount approval

---

### 14. Preview and Actions

#### 14.1 Contract Preview Block

**Display Elements:**
- Contract number
- Resident name
- Client name
- Start date - End date (or "Beztermiņa")
- Room number
- Daily rate (with or without discount)
- Status badge (Melnraksts / Aktīvs / Pabeigts / Anulēts)

**Available Actions:**

1. **Skatīt** (View)
   - Opens contract detail view
   - Shows all fields and history
   - Read-only if status ≠ MELNRAKSTS

2. **Rediģēt** (Edit)
   - Available only if status = MELNRAKSTS
   - Returns to edit form
   - Can change any field

3. **Printēt** (Print)
   - Available if status = AKTĪVS
   - Generates PDF from template
   - Includes all appendixes
   - Opens print dialog

4. **Izveidot pielikumu** (Create Appendix)
   - Available if status = AKTĪVS
   - Opens amendment wizard
   - Selects amendment type
   - Generates new appendix document

5. **Anulēt** (Cancel)
   - Available if status = MELNRAKSTS or AKTĪVS
   - Requires reason and confirmation
   - Changes status to ANULĒTS
   - Records termination date

---

### 15. Reporting and Analytics

#### 15.1 Contract Reports

**Active Contracts Report:**
- Count by residence
- Count by care level
- Count by room type
- Average daily rate
- Total projected monthly revenue

**Expiring Contracts Report:**
- Contracts ending within next 30/60/90 days
- Renewal reminder workflow
- Resident retention tracking

**Amendment History Report:**
- Count and types of amendments
- Price change trend analysis
- Care level change frequency

#### 15.2 Financial Analytics

**Revenue by Product:**
- Daily rate × occupancy
- Breakdown by care level
- Discount impact analysis

**Occupancy by Room Type:**
- 1-bed vs 2-bed utilization
- Revenue per room type
- Waiting list correlation

---

### 16. Technical Implementation Notes

#### 16.1 Document Generation Library

**Recommended:** PHPWord or Laravel DOMPDF
- Template: .docx with merge fields
- Merge fields: `{rezidenta_vārds}`, `{līguma_numurs}`, etc.
- Generate PDF for printing
- Store both .docx and .pdf versions

#### 16.2 Contract Number Generation

**Sequential Logic:**
```php
function generateContractNumber($residence, $year) {
    $prefix = ($residence == 'melodija') ? 'AM' : 'AŠ';
    
    // Get last contract number for this residence and year
    $lastContract = Ligumi::where('līguma_numurs', 'LIKE', "$prefix-%/$year")
                          ->orderBy('līguma_numurs', 'desc')
                          ->first();
    
    if ($lastContract) {
        // Extract number and increment
        preg_match('/' . $prefix . '-(\d+)\//', $lastContract->līguma_numurs, $matches);
        $nextNumber = intval($matches[1]) + 1;
    } else {
        // First contract of the year
        $nextNumber = ($residence == 'melodija') ? 2988 : 0;
    }
    
    return sprintf("%s-%04d/%d", $prefix, $nextNumber, $year);
}
```

#### 16.3 Product Selection Query

```php
function findProduct($careLevel, $roomType, $residence, $termType, $effectiveDate) {
    return Produkti::where('aprūpes_līmenis', $careLevel)
                   ->where('istabas_tips', $roomType)
                   ->where('rezidence', $residence)
                   ->where('termiņa_tips', $termType)
                   ->where('aktīvs', TRUE)
                   ->where('derīgs_no', '<=', $effectiveDate)
                   ->where(function($q) use ($effectiveDate) {
                       $q->whereNull('derīgs_līdz')
                         ->orWhere('derīgs_līdz', '>=', $effectiveDate);
                   })
                   ->first();
}
```

#### 16.4 Livewire Component Structure

```php
// Contract creation form
class LigumaIzveide extends Component
{
    public $līguma_numurs;
    public $sākuma_datums;
    public $beigu_datums;
    public $nav_beigu_datums = false;
    
    public $rezidenta_id;
    public $klienta_id;
    public $rezidents_ir_klients = false;
    
    public $aprūpes_līmenis;
    public $rezidence;
    public $istabas_tips_filtrs = 'viss';
    public $izvēlētā_istaba_id;
    
    public $atlaide_10_procenti = false;
    public $piezīmes;
    
    public $dienas_cena;
    public $dienas_cena_ar_atlaidi;
    
    public function mount($rezidenta_id) {
        $this->loadResidentData($rezidenta_id);
    }
    
    public function updated($propertyName) {
        if (in_array($propertyName, ['aprūpes_līmenis', 'rezidence', 
                                     'istabas_tips_filtrs', 'izvēlētā_istaba_id',
                                     'atlaide_10_procenti'])) {
            $this->recalculatePrice();
        }
    }
    
    public function saglabātMelnraksts() {
        // Save as draft (no validation)
    }
    
    public function saglabāt() {
        // Validate and save as active
    }
}
```

---

### 17. Open Questions and Pending Decisions

#### From ClickUp:

**AD-64: Preview Block Additional Actions**
- What actions needed besides listed ones?
- Should we support contract export to external systems?

**AD-65: Amendment/Appendix Templates**
- Need sample amendment documents from Adoro
- What format for care level calculation appendix?

**AD-83: Contract Template Validity**
- Are 2020 templates still current?
- Any legal changes needed for 2026?

**AD-84: "Other Additional Services" Definition**
- How are these tracked?
- Are they addendums to contract?
- Pricing separate or included?

**AD-85: Three-Bed Room Pricing**
- Is 3-bed room type supported?
- Pricing structure same as 1-bed/2-bed?

**AD-86: Care Level Determination Process**
- How often reassessments occur?
- Who approves care level changes?
- Automatic or manual contract amendments?

**AD-87: Price Change Agreement Sample**
- Template for annual price increases?
- Batch process or individual?
- Notification workflow?

---

### 18. Success Criteria

The contract creation system is successful when:

1. **Efficiency:** Contract creation time reduced from 30 minutes to <5 minutes
2. **Accuracy:** Zero manual errors in contract field population
3. **Compliance:** All contracts follow sequential numbering
4. **Auditability:** Complete history of contract changes
5. **Automation:** Product pricing auto-selected correctly 100% of time
6. **User Satisfaction:** Administrators report system as "easy to use"
7. **Document Quality:** Generated contracts match Word templates exactly

---

### 19. Implementation Phases

**Phase 1: Core Functionality** (2-3 weeks)
- Data model implementation
- Product master setup
- Basic contract CRUD
- Draft/Active workflow
- Single template support (Melodija)

**Phase 2: Document Generation** (1-2 weeks)
- Template engine integration
- Field population logic
- PDF generation
- Print functionality

**Phase 3: Amendment System** (1-2 weeks)
- Appendix generation
- Amendment workflow
- Change history tracking
- Price change handling

**Phase 4: Šampēteris Support** (1 week)
- Second template support
- Care level calculation appendix
- Template selection logic

**Phase 5: Integration** (1 week)
- Room management integration
- Invoicing system link
- Care assessment connection
- Municipality subsidy link

**Phase 6: Polish** (1 week)
- UI/UX refinement
- Validation enhancement
- Reporting dashboards
- User acceptance testing

---

### Appendix A: Sample Contract Data

**Example Product:**
```json
{
  "kods": "AM-GIR3-1V-ILG",
  "nosaukums": "Adoro Melodija - GIR3 - 1-vietīga - Ilgtermiņa",
  "rezidence": "melodija",
  "aprūpes_līmenis": "GIR3",
  "istabas_tips": "1-vietīga",
  "termiņa_tips": "ilgtermiņa",
  "dienas_cena": 62.50,
  "derīgs_no": "2026-01-01",
  "derīgs_līdz": null,
  "aktīvs": true
}
```

**Example Contract:**
```json
{
  "līguma_numurs": "AM-2988/2026",
  "statuss": "aktīvs",
  "rezidenta_id": 12345,
  "klienta_id": 67890,
  "sākuma_datums": "2026-02-01",
  "beigu_datums": null,
  "nav_beigu_datums": true,
  "produkta_id": 501,
  "dienas_cena": 62.50,
  "atlaide_procenti": 10.00,
  "dienas_cena_ar_atlaidi": 56.25,
  "istabas_id": 205,
  "piezīmes": "Resident requested discount due to long-term commitment"
}
```

---

### Appendix B: UI Wireframe Descriptions

**Contract List View:**
```
+-----------------------------------------------------------+
| Līgumi                                    [+ Jauns līgums] |
+-----------------------------------------------------------+
| Filtri: [Visi] [Melnraksti] [Aktīvi] [Pabeigti]          |
|         Meklēt: [___________] [Meklēt]                     |
+-----------------------------------------------------------+
| AM-2988/2026 | Jānis Bērziņš     | 01.02.2026 | [Aktīvs]  |
|              | Istaba 205        | Beztermiņa | €56.25    |
|              | [Skatīt] [Printēt] [Pielikums]              |
+-----------------------------------------------------------+
| AM-2989/2026 | Anna Kalniņa      | 15.01.2026 | [Melnraksts]|
|              | Istaba 103        | 31.12.2026 | €72.00    |
|              | [Skatīt] [Rediģēt] [Dzēst]                 |
+-----------------------------------------------------------+
```

**Contract Creation Form:**
```
+-----------------------------------------------------------+
| Jauns līgums                                               |
+-----------------------------------------------------------+
| Līguma numurs*: [AM-____/2026]                            |
| Datums:         [01.02.2026] - [__________]               |
|                 ☐ Nav beigu datums                        |
+-----------------------------------------------------------+
| Rezidents*:     [Jānis Bērziņš ▼] (automātiski)           |
| Klients*:       [Ilze Bērziņa ▼]                          |
|                 ☑ Rezidents pats būs klients              |
+-----------------------------------------------------------+
| Aprūpes līmenis: [GIR 3 ▼]       (filtrs)                |
| Rezidence:       [Melodija ▼]    (filtrs)                |
| Istabas tips:    (•) Viss  ( ) 1-vietīgs  ( ) 2-vietīgs  |
+-----------------------------------------------------------+
| Pieejamās istabas:                                        |
| ( ) Istaba 201 - 1. stāvs - 1-vietīga - Brīva            |
| (•) Istaba 205 - 2. stāvs - 1-vietīga - Brīva            |
| ( ) Istaba 210 - 2. stāvs - 2-vietīga - 1 vieta brīva    |
+-----------------------------------------------------------+
| Dzīvošanas izmaksas: €62.50 / diennakts                  |
| ☑ Piemērot 10% atlaidi → €56.25 / diennakts              |
+-----------------------------------------------------------+
| Piezīmes: [________________________________]               |
+-----------------------------------------------------------+
| [Atcelt]  [Saglabāt kā melnrakstu]  [Saglabāt]           |
+-----------------------------------------------------------+
```

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-07 | System Analysis | Initial specification based on AD-58 requirements |

