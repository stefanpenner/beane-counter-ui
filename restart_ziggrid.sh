#!/bin/bash

ssh -t -t -l ec2-user -i chef-test.pem 54.221.222.163 "sudo service ziggrid restart"

