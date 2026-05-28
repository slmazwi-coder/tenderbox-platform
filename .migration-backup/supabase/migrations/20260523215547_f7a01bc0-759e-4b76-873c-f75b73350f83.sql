
-- CONTRACTORS
CREATE TABLE public.contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  cipc_number text,
  vat_number text,
  csd_number text,
  cidb_grade text,
  bbbee_level integer,
  profile_type text,
  sectors text,
  tender_readiness_score numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view contractors"
  ON public.contractors FOR SELECT TO authenticated USING (true);

-- COMPLIANCE DOCUMENTS
CREATE TABLE public.compliance_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id uuid REFERENCES public.contractors(id) ON DELETE CASCADE,
  doc_type text,
  verification_status text,
  expiry_date date,
  upload_date timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view compliance documents"
  ON public.compliance_documents FOR SELECT TO authenticated USING (true);

-- TENDERS
CREATE TABLE public.tenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_ref text UNIQUE,
  title text NOT NULL,
  description text,
  category text,
  province text,
  budget numeric,
  closing_date timestamptz,
  status text,
  cidb_grade_required text,
  briefing_type text,
  briefing_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view tenders"
  ON public.tenders FOR SELECT TO authenticated USING (true);

-- BIDS
CREATE TABLE public.bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid REFERENCES public.tenders(id) ON DELETE CASCADE,
  contractor_id uuid REFERENCES public.contractors(id) ON DELETE CASCADE,
  tracking_id text UNIQUE,
  submission_timestamp timestamptz,
  total_bid_price numeric,
  status text,
  compliance_score numeric,
  functionality_score numeric,
  price_score numeric,
  bbbee_score numeric,
  total_score numeric,
  rank integer,
  red_flags text
);
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view bids"
  ON public.bids FOR SELECT TO authenticated USING (true);

-- PAYMENT CERTIFICATES
CREATE TABLE public.payment_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid REFERENCES public.tenders(id) ON DELETE CASCADE,
  contractor_id uuid REFERENCES public.contractors(id) ON DELETE CASCADE,
  certificate_number text,
  certified_amount numeric,
  invoice_submitted_date date,
  qs_signed boolean NOT NULL DEFAULT false,
  qs_signed_date timestamptz,
  pa_signed boolean NOT NULL DEFAULT false,
  pa_signed_date timestamptz,
  pm_signed boolean NOT NULL DEFAULT false,
  pm_signed_date timestamptz,
  pmu_signed boolean NOT NULL DEFAULT false,
  pmu_signed_date timestamptz,
  cfo_signed boolean NOT NULL DEFAULT false,
  cfo_signed_date timestamptz,
  mm_signed boolean NOT NULL DEFAULT false,
  mm_signed_date timestamptz,
  payment_released boolean NOT NULL DEFAULT false,
  payment_released_date timestamptz,
  due_date date,
  status text
);
ALTER TABLE public.payment_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view payment certificates"
  ON public.payment_certificates FOR SELECT TO authenticated USING (true);

-- BRIEFING ATTENDANCE
CREATE TABLE public.briefing_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid REFERENCES public.tenders(id) ON DELETE CASCADE,
  contractor_id uuid REFERENCES public.contractors(id) ON DELETE CASCADE,
  attendee_name text,
  attendee_designation text,
  sign_in_time timestamptz,
  sign_out_time timestamptz,
  attendance_confirmed boolean NOT NULL DEFAULT false
);
ALTER TABLE public.briefing_attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view briefing attendance"
  ON public.briefing_attendance FOR SELECT TO authenticated USING (true);

-- Helpful indexes
CREATE INDEX ON public.compliance_documents (contractor_id);
CREATE INDEX ON public.bids (tender_id);
CREATE INDEX ON public.bids (contractor_id);
CREATE INDEX ON public.payment_certificates (tender_id);
CREATE INDEX ON public.payment_certificates (contractor_id);
CREATE INDEX ON public.briefing_attendance (tender_id);
CREATE INDEX ON public.briefing_attendance (contractor_id);
