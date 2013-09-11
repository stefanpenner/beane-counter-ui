#!/bin/bash

ssh -t -t -l ec2-user -i chef-test.pem 54.227.144.158  "sudo service ziggen restart"

