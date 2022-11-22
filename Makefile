IMAGE=harbor.liebi.com/slp/slp-moonriver-subql-vglmr:v1.2
DEPLOYMENT=glmr-glmr-subql

build:
	docker build -f Dockerfile -t ${IMAGE} .
	docker push ${IMAGE}

deploy: build
	kubectl set image deploy -n slp ${DEPLOYMENT} ${DEPLOYMENT}=${IMAGE}
	kubectl rollout restart deploy  -n slp  ${DEPLOYMENT}
