cat > .htaccess << EOF
# Disable index view
Options -Indexes

# Hide a specific file
<Files .env>
    Order allow,deny
    Deny from all
</Files>
EOF
