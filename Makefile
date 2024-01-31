IMAGE=harbor.liebi.com/slp/slp-moonriver-subql-vglmr:v1.3
DEPLOYMENT=glmr-glmr-subql

build:
	docker build -f Dockerfile -t ${IMAGE} .
	docker push ${IMAGE}

deploy: build
	kubectl set image deploy -n slp ${DEPLOYMENT} ${DEPLOYMENT}=${IMAGE}
	kubectl rollout restart deploy  -n slp  ${DEPLOYMENT}

create-projent-cm:
	kubectl create cm glmr-glmr-subql-project --from-file=project.yaml -n slp
