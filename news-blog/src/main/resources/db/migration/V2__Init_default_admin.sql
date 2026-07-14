INSERT INTO users (username, email, password, role)
VALUES (
           '${admin_username}',
           '${admin_email}',
           '${admin_password_hash}',
           'ADMIN'
       ) ON CONFLICT (email) DO NOTHING;