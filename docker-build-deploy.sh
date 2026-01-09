#!/bin/bash
echo 'username and password are both a DO token with access to the registry'
docker login registry.digitalocean.com
TAG=registry.digitalocean.com/rriv/chirpstack-webhook:$1
docker build . -t $TAG
docker push $TAG

cd deployment/overlays/development
kustomize edit set image $TAG
cd ../prod
kustomize edit set image $TAG
cd ../../../

kustomize build deployment/overlays/prod/ | kubectl apply -f -
