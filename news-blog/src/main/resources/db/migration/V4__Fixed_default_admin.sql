UPDATE users SET password = '${admin_password_hash}'
WHERE username = 'admin';