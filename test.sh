# cat > .htaccess << EOF
# # Disable index view
# Options -Indexes

# # Hide a specific file
# <Files .env>
#     Order allow,deny
#     Deny from all
# </Files>
# EOF https://stackoverflow.com/questions/48470049/build-a-json-string-with-bash-variables
# https://unix.stackexchange.com/questions/735757/how-to-add-a-key-value-pair-into-a-json-file-with-jq

foo='[{"login":"DanYellow","id":2885711,"avatar_url":"https://avatars.githubusercontent.com/u/2885711?v=4","gravatar_id":"","url":"https://api.github.com/users/DanYellow","html_url":"https://github.com/DanYellow"}, {"login":"DanYellow2","id":2885711,"avatar_url":"https://avatars.githubusercontent.com/u/2885711?v=4","gravatar_id":"","url":"https://api.github.com/users/DanYellow","html_url":"https://github.com/DanYellow"}]'
# https://stackoverflow.com/questions/72215851/how-to-append-json-array-using-jqshell-in-a-loop
# result='[]'
result='[]'
for collaborator_login in `echo $foo | jq --raw-output -c '.[]'`; do
    # login=`echo $collaborator_login | jq '.login'`
    login=$(echo $collaborator_login | jq '.login')
    # echo "/users/${login | jq --raw-output}"
    echo "/users/$(echo $login | jq --raw-output)"

    echo "$(echo /users/$(echo $login | jq --raw-output))"
    # echo "$(gh api /users/$(echo $login | jq --raw-output))"
    # $(jq --raw-output <<< "$login")
    # obj="{}"
    # avatar_url=`echo $collaborator_login | jq '.avatar_url'`

    # # obj="$(jq '.skipLibCheck=true' <<< "$obj")"
    # obj="$(jq ".avatar_url=${avatar_url}" <<< "$obj")"
    # obj="$(jq ".login=${login}" <<< "$obj")"

    # # result="$(jq --arg val "$obj" '.[] += [$val]' <<< "$result")"
    # # result="$(jq '.names += [$obj]' <<< "$result")"
    # # result="$(jq '.names += [{"name" : "santa", "name1" : "santa"}]' <<< "$result")"
    # result="$(jq --argjson val "$obj" '. += [$val]' <<< "$result")"



    # obj=`echo $obj | jq ".avatar_url=${avatar_url}"`
    # jq ".avatar_url=${avatar_url}" <<< "$obj"
    # jq ".login=${login}" <<< "$obj"
    # jq '. += { "key": "value" }' <<<"$obj"
    # jq '. += { "keyr": "valuee" }' <<<"$obj"


    # echo $obj > foo.tmp.json
    # echo $obj | jq ".login=${name}"


    # echo ".login=${name}";
    # echo $obj | jq '.login=${name}'
done

result="$(jq '.| tostring' <<< "$result")"

echo "$result"
echo "$result" > foo.tmp.json


# list_collaborators="$(gh api /repos/DanYellow/test/collaborators)"
#             list_collaborators_login=`echo $list_collaborators | jq '[.[].login]'`
#             # echo "$list_collaborators_login"

#             res=()
#             for collaborator_login in `echo $list_collaborators_login | jq --raw-output -c '.[]'`; do
#               collaborator_login_request="$(gh api /users/${collaborator_login})"

#               collaborator=(
#                 [url]=`echo $collaborator_login_request | jq '.html_url'`
#                 [name]=`echo $collaborator_login_request | jq '.name'`
#                 [login]=$collaborator_login
#               )
#               # "$collaborator_login_request" | jq '.url'
#               # echo $collaborator

#               res+=($collaborator)
#             done

#             echo "VITE_HELLO=$res" >> "$GITHUB_ENV"
#             echo "$res" >> "./foo.json"

#             # for collaborator in `echo $res | jq --raw-output -c '.[]'`; do
#             #   echo $collaborator | jq '.url'
#             #   echo $collaborator | jq '.name'
#             # done
