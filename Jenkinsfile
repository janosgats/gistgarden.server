#!groovy


String RELEASE_IMAGE_NAME_WITH_USERNAME = 'gjani/gistgarden-server'

MAIN_BRANCH_TO_DEPLOY = 'master'


K8S_NAMESPACE = 'gistgarden'
K8S_DEPLOYMENT_NAME = 'gistgarden-srv'
K8S_CONTAINER_NAME = 'srv'


//Stages (because enum is disabled in the runtime)
STAGE_BUILD_DOCKER_IMAGE = 'STAGE_BUILD_DOCKER_IMAGE'
STAGE_UNIT_TESTS = 'STAGE_UNIT_TESTS'
STAGE_DEPLOY_TO_K8SC1 = 'STAGE_DEPLOY_TO_K8SC1'

def boolean shouldStageBeExecutedByDefault(stage) {
    switch (stage) {
        case STAGE_BUILD_DOCKER_IMAGE:
        case STAGE_UNIT_TESTS:
            return true;
        case STAGE_DEPLOY_TO_K8SC1:
            return env.BRANCH_NAME == MAIN_BRANCH_TO_DEPLOY;
    }

    error "Unrecognized stage in shouldStageBeExecutedByDefault: ${stage}"
}

def boolean shouldStageBeExecutedByCustomization(stage) {
    switch (stage) {
        case STAGE_BUILD_DOCKER_IMAGE:
            return params.CUSTOM_EXECUTE_STAGE_BUILD_IMAGE;
        case STAGE_UNIT_TESTS:
            return params.CUSTOM_EXECUTE_STAGE_UNIT_TESTS;
        case STAGE_DEPLOY_TO_K8SC1:
            return params.CUSTOM_EXECUTE_STAGE_DEPLOY_TO_K8SC1;
    }

    error "Unrecognized Stage in shouldStageBeExecutedByCustomization: ${stage}"
}

def boolean shouldStageBeExecuted(stage) {
    boolean result;

    if (params.CUSTOMIZE_EXECUTED_BUILD_STAGES) {
        result = shouldStageBeExecutedByCustomization(stage);
    } else {
        result = shouldStageBeExecutedByDefault(stage);
    }

    echo 'Result of shouldStageBeExecuted(' + stage + ') is ' + result + '. params.CUSTOMIZE_EXECUTED_BUILD_STAGES: ' + params.CUSTOMIZE_EXECUTED_BUILD_STAGES
    return result;
}

def shouldPublishImageAsLatest = env.BRANCH_NAME == MAIN_BRANCH_TO_DEPLOY
def isReleaseBuild = shouldStageBeExecuted(STAGE_DEPLOY_TO_K8SC1)

pipeline {
    agent any

    parameters {
        booleanParam(
                defaultValue: false,
                description: 'Check this to override if build stages should be executed or not',
                name: 'CUSTOMIZE_EXECUTED_BUILD_STAGES'
        )
        booleanParam(
                defaultValue: true,
                description: 'Build docker image',
                name: 'CUSTOM_EXECUTE_STAGE_BUILD_IMAGE'
        )
        booleanParam(
                defaultValue: false,
                description: 'Run unit tests',
                name: 'CUSTOM_EXECUTE_STAGE_UNIT_TESTS'
        )
        booleanParam(
                defaultValue: false,
                description: 'Deploy to k8sc1',
                name: 'CUSTOM_EXECUTE_STAGE_DEPLOY_TO_K8SC1'
        )
    }

    environment {
        SHORT_COMMIT_HASH = "${env.GIT_COMMIT.substring(0, 10)}"
        DOCKER_COMPATIBLE_BRANCH_NAME = "${env.BRANCH_NAME.replace('/', '-')}"

        IMAGE_TAG_COMMIT = "${RELEASE_IMAGE_NAME_WITH_USERNAME}:${env.DOCKER_COMPATIBLE_BRANCH_NAME}_${env.SHORT_COMMIT_HASH}"
        IMAGE_TAG_LATEST = "${RELEASE_IMAGE_NAME_WITH_USERNAME}:latest"
    }

    stages {

        stage('Build Release Image') {
            when { expression { return shouldStageBeExecuted(STAGE_BUILD_DOCKER_IMAGE) } }
            steps {
                script {
                    String optionalLatestTag = "";

                    if (shouldPublishImageAsLatest) {
                        optionalLatestTag = " -t ${IMAGE_TAG_LATEST} "
                    }

                    sh "docker build" +
                            " --target release" +
                            " -f ./docker/Dockerfile-k8s" +
                            " -t ${IMAGE_TAG_COMMIT}" +
                            optionalLatestTag +
                            " ."
                }
            }
        }


        stage('Publish Docker Image') {
            when { expression { return shouldStageBeExecuted(STAGE_BUILD_DOCKER_IMAGE) && isReleaseBuild } }
            steps {
                script {
                    echo 'Logging in to docker...'
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_GJANI_READ_AND_WRITE', passwordVariable: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_HUB_USER')]) {
                        sh 'echo ${DOCKER_HUB_PASSWORD} | docker login -u ${DOCKER_HUB_USER} --password-stdin'
                    }

                    echo 'Publishing docker image...'

                    sh "docker push ${IMAGE_TAG_COMMIT}"
                    if (shouldPublishImageAsLatest) {
                        sh "docker push ${IMAGE_TAG_LATEST}"
                    }
                }
            }
        }


        stage('Deploy to k8sc1') {
            when { expression { return shouldStageBeExecuted(STAGE_DEPLOY_TO_K8SC1) } }
            steps {
                script {
                    withKubeConfig([credentialsId: 'kubeconfig-k8sc1-for-jenkins-lan', contextName  : 'jenkins-lan/home-1',]) {
                        echo "Starting deployment..."
                        sh "kubectl -n=${K8S_NAMESPACE} set image deployments/${K8S_DEPLOYMENT_NAME} ${K8S_CONTAINER_NAME}=${IMAGE_TAG_COMMIT}"

                        echo "Verifying rollout..."
                        sh "kubectl -n=${K8S_NAMESPACE} rollout status deployment ${K8S_DEPLOYMENT_NAME}"
                    }
                }
            }
        }
    } // stages

    post {
        cleanup {
            cleanWs()
        }
    }
}
