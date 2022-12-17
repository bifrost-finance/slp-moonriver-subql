IMAGE=harbor.liebi.com/slp/slp-moonriver-subql:v1.2
DEPLOYMENT=vmovr-moonriver-subql

build:
	docker build --no-cache -f Dockerfile -t ${IMAGE} .
	docker push ${IMAGE}

deploy: build
	kubectl set image deploy -n slp ${DEPLOYMENT} ${DEPLOYMENT}=${IMAGE}
	kubectl rollout restart deploy  -n slp  ${DEPLOYMENT}
