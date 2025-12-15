-- RLS hardening migration: add safe UPDATE/DELETE policies

-- 1) seller_profiles: allow users to delete ONLY their own seller profile
CREATE POLICY "Users can delete own seller profile"
ON public.seller_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- 2) payments: allow users to update/delete ONLY their own payments
CREATE POLICY "Users can update own payments"
ON public.payments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payments"
ON public.payments
FOR DELETE
USING (auth.uid() = user_id);

-- 3) gst_filings: allow users to delete ONLY their own GST filings
CREATE POLICY "Users can delete own gst filings"
ON public.gst_filings
FOR DELETE
USING (auth.uid() = user_id);

-- 4) tax_calculations: allow users to update/delete ONLY their own tax calculations
CREATE POLICY "Users can update own tax calculations"
ON public.tax_calculations
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tax calculations"
ON public.tax_calculations
FOR DELETE
USING (auth.uid() = user_id);

-- 5) subscriptions: allow users to delete ONLY their own subscriptions
CREATE POLICY "Users can delete own subscriptions"
ON public.subscriptions
FOR DELETE
USING (auth.uid() = user_id);