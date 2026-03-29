-- =====================================================
-- إعداد نظام الصلاحيات - الناشر الوحيد
-- =====================================================

-- 1. إنشاء جدول المشرفين
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. إضافة فهرس
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- 3. إضافة حسابك كمشرف (⚠️ استبدل YOUR_UUID_HERE)
INSERT INTO admin_users (user_id)
VALUES ('YOUR_UUID_HERE')
ON CONFLICT (user_id) DO NOTHING;

-- 4. تفعيل RLS على articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 5. إزالة السياسات القديمة إذا وجدت
DROP POLICY IF EXISTS "Anyone can read published articles" ON articles;
DROP POLICY IF EXISTS "Admins can read all articles" ON articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON articles;
DROP POLICY IF EXISTS "Admins can update articles" ON articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON articles;

-- 6. سياسات جديدة
CREATE POLICY "Anyone can read published articles"
ON articles
FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can read all articles"
ON articles
FOR SELECT
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admins can insert articles"
ON articles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admins can update articles"
ON articles
FOR UPDATE
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM admin_users))
WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admins can delete articles"
ON articles
FOR DELETE
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- 7. التحقق
SELECT '✅ تم الإعداد بنجاح!' as status;
SELECT COUNT(*) as عدد_المشرفين FROM admin_users;