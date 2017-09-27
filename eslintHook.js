var fs = require('fs')
var path = require('path')
var styles = {  
  'bold'          : ['\x1B[1m',  '\x1B[22m'],  
  'italic'        : ['\x1B[3m',  '\x1B[23m'],  
  'underline'     : ['\x1B[4m',  '\x1B[24m'],  
  'inverse'       : ['\x1B[7m',  '\x1B[27m'],  
  'strikethrough' : ['\x1B[9m',  '\x1B[29m'],  
  'white'         : ['\x1B[37m', '\x1B[39m'],  
  'grey'          : ['\x1B[90m', '\x1B[39m'],  
  'black'         : ['\x1B[30m', '\x1B[39m'],  
  'blue'          : ['\x1B[34m', '\x1B[39m'],  
  'cyan'          : ['\x1B[36m', '\x1B[39m'],  
  'green'         : ['\x1B[32m', '\x1B[39m'],  
  'magenta'       : ['\x1B[35m', '\x1B[39m'],  
  'red'           : ['\x1B[31m', '\x1B[39m'],  
  'yellow'        : ['\x1B[33m', '\x1B[39m'],  
  'whiteBG'       : ['\x1B[47m', '\x1B[49m'],  
  'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'],  
  'blackBG'       : ['\x1B[40m', '\x1B[49m'],  
  'blueBG'        : ['\x1B[44m', '\x1B[49m'],  
  'cyanBG'        : ['\x1B[46m', '\x1B[49m'],  
  'greenBG'       : ['\x1B[42m', '\x1B[49m'],  
  'magentaBG'     : ['\x1B[45m', '\x1B[49m'],  
  'redBG'         : ['\x1B[41m', '\x1B[49m'],  
  'yellowBG'      : ['\x1B[43m', '\x1B[49m']  
};
var git_pre_hook = '.git/hooks/pre-commit'
var eslint_hook = `#!/bin/sh
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep ".jsx\{0,1\}$")
if [[ "$STAGED_FILES" = "" ]]; then
  exit 0
fi
PASS=true
echo "\n${styles.blue.join('%s')}准备校验JavaScript:\n"
# Check for eslint
which eslint &> /dev/null
if [[ "$?" == 1 ]]; then
  echo "${styles.yellow.join('%s')}EsLint 未安装,请全局安装(npm i -g eslint)"
  exit 1
fi
for FILE in $STAGED_FILES
do
  eslint "$FILE"
  if [[ "$?" == 0 ]]; then
    echo "${styles.green.join('%s')}ESLint Passed: $FILE"
  else
    echo "${styles.red.join('%s')}ESLint Failed: $FILE"
    PASS=false
  fi
done
echo "\n!\n校验完毕"
if ! $PASS; then
  echo "${styles.red.join('%s')}COMMIT FAILED:Your commit contains files that should pass ESLint but do not. Please fix the ESLint errors and try again.\n"
  exit 1
else
  echo "COMMIT SUCCEEDED\n"
fi
exit $?`  

fs.writeFile(git_pre_hook,eslint_hook,function(err){
  if(err) throw err
  else {
    console.log(styles.blue.join('%s'),'配置eslint git 前置hook成功,以后执行git commit会先执行eslint校验')
  }
})