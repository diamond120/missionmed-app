pipeline {
    agent any
    stages {
        stage("Verify docker") {
            steps {
                sh '''
                    docker info
                    docker version
                    docker-compose version
                '''
            }
        }
        stage("Clear all running docker containers") {
            steps {
                script {
                    try {
                        sh 'docker rm -f $(docker ps -a -q)'
                    } catch (Exception e) {
                        echo 'No running container to clear up...'
                    }
                }
            }
        }
        stage("Start Docker") {
            steps {
                sh 'make build'
                sh 'make up'
                sh 'docker-compose ps'
            }
        }
    }
    post {
        success {
            echo 'Success.'
        }
    }
}
