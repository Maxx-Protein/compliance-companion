-- Create enum for business types
CREATE TYPE public.business_type AS ENUM ('sole_proprietor', 'partnership', 'pvt_ltd', 'llp');

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create seller_profiles table
CREATE TABLE public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT,
  gstin TEXT UNIQUE,
  pan TEXT,
  business_type public.business_type,
  gst_registration_date DATE,
  financial_year_start DATE DEFAULT '2025-04-01',
  bank_account_number TEXT,
  bank_ifsc TEXT,
  registered_address TEXT,
  business_address TEXT,
  platforms_selling TEXT[] DEFAULT ARRAY[]::TEXT[],
  seller_accounts JSONB DEFAULT '{}'::JSONB,
  product_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  bis_certified_products TEXT[] DEFAULT ARRAY[]::TEXT[],
  subscription_status TEXT DEFAULT 'free',
  subscription_plan_id TEXT,
  subscription_active BOOLEAN DEFAULT false,
  razorpay_customer_id TEXT,
  last_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  hsn_code TEXT NOT NULL,
  gst_rate TEXT NOT NULL DEFAULT '18%',
  bis_certified BOOLEAN DEFAULT false,
  bis_certificate_number TEXT,
  bis_expiry_date DATE,
  unit_price DECIMAL(10, 2),
  category TEXT,
  sku TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_name TEXT NOT NULL,
  customer_gstin TEXT,
  customer_state TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::JSONB,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sgst_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  cgst_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  igst_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  gst_slab TEXT,
  place_of_supply TEXT NOT NULL,
  invoice_status TEXT DEFAULT 'draft',
  payment_status TEXT DEFAULT 'unpaid',
  notes TEXT,
  tcs_deducted DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  issued_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create gst_filings table
CREATE TABLE public.gst_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  financial_month TEXT NOT NULL,
  gstr_1_filed BOOLEAN DEFAULT false,
  gstr_1_filed_date DATE,
  gstr_3b_filed BOOLEAN DEFAULT false,
  gstr_3b_filed_date DATE,
  gstr_6_filed BOOLEAN DEFAULT false,
  gstr_9_filed BOOLEAN DEFAULT false,
  gstr_9_filed_date DATE,
  total_sales DECIMAL(12, 2) DEFAULT 0,
  total_purchases DECIMAL(12, 2) DEFAULT 0,
  itc_claimed DECIMAL(10, 2) DEFAULT 0,
  gst_liability DECIMAL(10, 2) DEFAULT 0,
  tcs_liability DECIMAL(10, 2) DEFAULT 0,
  net_payable DECIMAL(10, 2) DEFAULT 0,
  filing_status TEXT DEFAULT 'pending',
  due_date DATE,
  filing_deadline DATE,
  filed_on_time BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create compliance_checklist table
CREATE TABLE public.compliance_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  compliance_item TEXT NOT NULL,
  compliance_status TEXT DEFAULT 'pending',
  compliance_date DATE,
  expiry_date DATE,
  document_url TEXT,
  notes TEXT,
  reminder_set BOOLEAN DEFAULT false,
  reminder_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tax_calculations table
CREATE TABLE public.tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  calculation_type TEXT NOT NULL,
  input_values JSONB NOT NULL DEFAULT '{}'::JSONB,
  output_results JSONB NOT NULL DEFAULT '{}'::JSONB,
  calculation_month TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_order_id TEXT,
  razorpay_signature TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'created',
  payment_method TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  razorpay_subscription_id TEXT UNIQUE,
  razorpay_plan_id TEXT,
  plan_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  billing_cycle TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  current_start_date TIMESTAMPTZ,
  current_end_date TIMESTAMPTZ,
  next_payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gst_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for seller_profiles
CREATE POLICY "Users can view own seller profile"
  ON public.seller_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own seller profile"
  ON public.seller_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own seller profile"
  ON public.seller_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for products
CREATE POLICY "Users can view own products"
  ON public.products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for invoices
CREATE POLICY "Users can view own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices"
  ON public.invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices"
  ON public.invoices FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for gst_filings
CREATE POLICY "Users can view own gst filings"
  ON public.gst_filings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gst filings"
  ON public.gst_filings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gst filings"
  ON public.gst_filings FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for compliance_checklist
CREATE POLICY "Users can view own compliance items"
  ON public.compliance_checklist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own compliance items"
  ON public.compliance_checklist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own compliance items"
  ON public.compliance_checklist FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own compliance items"
  ON public.compliance_checklist FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for tax_calculations
CREATE POLICY "Users can view own tax calculations"
  ON public.tax_calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax calculations"
  ON public.tax_calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for audit_logs
CREATE POLICY "Users can view own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers for tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seller_profiles_updated_at
  BEFORE UPDATE ON public.seller_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gst_filings_updated_at
  BEFORE UPDATE ON public.gst_filings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_checklist_updated_at
  BEFORE UPDATE ON public.compliance_checklist
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();