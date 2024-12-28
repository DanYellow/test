# echo $SECRETS_CONTEXT
# echo "$super_secret"
# echo "$1"
# echo $SECRETS_CONTEXT | jq '.MYSQL_DATABASE'

# mysql -u $MYSQL_USER \
#     -p$MYSQL_PASSWORD \
#     -h $MYSQL_SERVER $MYSQL_DATABASE < database.sql

MYSQL_USER = $(echo $SECRETS_CONTEXT | jq '.MYSQL_USER');
MYSQL_PASSWORD = $(echo $SECRETS_CONTEXT | jq '.MYSQL_PASSWORD');
MYSQL_SERVER = $(echo $SECRETS_CONTEXT | jq '.MYSQL_SERVER');
MYSQL_DATABASE = $(echo $SECRETS_CONTEXT | jq '.MYSQL_DATABASE');

mysql --defaults-extra-file=.my.cnf -h $MYSQL_SERVER $MYSQL_DATABASE < database.sql

# mysql \
# -u $MYSQL_USER \
    # -p$MYSQL_PASSWORD \
    # --ssl-mode=required \
    # -h $MYSQL_SERVER $MYSQL_DATABASE < database.sql

# mysql -u $(echo $SECRETS_CONTEXT | jq '.MYSQL_USER' --raw-output) \
#     -p $(echo $SECRETS_CONTEXT | jq '.MYSQL_PASSWORD' --raw-output) \
#     -h $(echo $SECRETS_CONTEXT | jq '.MYSQL_SERVER' --raw-output) $(echo $SECRETS_CONTEXT | jq '.MYSQL_DATABASE' --raw-output) < database.sql
# mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -h $MYSQL_SERVER $MYSQL_DATABASE < database.sql
