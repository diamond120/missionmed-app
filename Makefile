#!/usr/bin/make

SHELL = /bin/sh

UID := $(shell id -u)
GID := $(shell id -g)
USER:= $(shell whoami)

export UID
export GID
export USER

build:
	docker-compose -f docker-compose.dev.yml build --no-cache

up:
	docker-compose -f docker-compose.dev.yml up -d
