#!/bin/bash

trap 'kill 0' INT
sleep infinity &
wait
