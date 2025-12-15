-- Add image_url column to products for storing product image links
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS image_url text;

-- Create a storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read access to product images'
  ) THEN
    CREATE POLICY "Public read access to product images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-images');
  END IF;
END $$;

-- Allow authenticated users to upload product images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload product images'
  ) THEN
    CREATE POLICY "Authenticated users can upload product images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'product-images');
  END IF;
END $$;

-- Allow authenticated users to update product images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update product images'
  ) THEN
    CREATE POLICY "Authenticated users can update product images"
    ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'product-images');
  END IF;
END $$;

-- Allow authenticated users to delete product images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete product images'
  ) THEN
    CREATE POLICY "Authenticated users can delete product images"
    ON storage.objects
    FOR DELETE
    USING (bucket_id = 'product-images');
  END IF;
END $$;