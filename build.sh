#!/bin/bash
set -o errexit

pip install -r requirements.txt
python mens_fashion/manage.py collectstatic --noinput
python mens_fashion/manage.py migrate
