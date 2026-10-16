UPDATE shodhan_instructors
SET login = lower(regexp_replace(trim(CASE WHEN id = 10 THEN 'Хара Дмитрий' ELSE full_name END), '\s+', ' ', 'g')),
    password_hash = encode(sha256(convert_to('ШОДХАН2026', 'UTF8')), 'hex')
WHERE role = 'instructor';

UPDATE shodhan_instructors
SET phone = 'login:' || login
WHERE role = 'instructor';