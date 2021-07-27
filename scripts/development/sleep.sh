#!/bin/bash

trap 'kill 0' INT
mkdir /root/.ssh
cp /app/mounted/authorized_keys /root/.ssh/authorized_keys
service ssh start
sleep infinity &
wait
