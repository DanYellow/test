echo $SECRETS_CONTEXT
echo "$SECRETS_CONTEXT"
mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -h $MYSQL_SERVER $MYSQL_DATABASE < database.sql
