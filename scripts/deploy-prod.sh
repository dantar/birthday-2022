#!/bin/bash
#set -v # do not expand variables
set -x # output
set -e # stop on error
set -u # stop if you use an uninitialized variable

TODAY=`date +%Y-%m-%d-%H-%M-%S`
echo $TODAY

HACKGIT=~/hack/git

export JAVA_HOME=/usr/lib/jvm/java-8-oracle

REMOTE="ssh dantar "

APPDIR=$HACKGIT/birthday-2020/birthday-rest
APPNAME=dantar-birthday
NGDIR=$HACKGIT/birthday-2022/birthday-ng
NGAPP=birthday

# build

cd $APPDIR
mvn clean install

cd $NGDIR
ng build --base-href=./ --configuration=production

# deploy

$REMOTE sudo /etc/init.d/$APPNAME stop
$REMOTE cp services/$APPNAME.jar backup/services/$APPNAME-$TODAY.jar
scp $APPDIR/target/birthday-rest-0.0.1-SNAPSHOT.jar dantar:services/$APPNAME.jar
$REMOTE sudo /etc/init.d/$APPNAME start

rsync --delete -varzh $NGDIR/dist/birthday-ng/* dantar:/home/daniele/html/$NGAPP/
