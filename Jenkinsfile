pipeline {
    agent any
    
    environment {
        DOCKER_SERVER = 'ubuntu@13.127.168.203'
        SONAR_HOST_URL = 'http://3.108.51.249:9000/'
        APP_NAME = 'mywebsite'
        CONTAINER_NAME = 'NodeJS'
        DOCKER_PORT = '8085'
        APP_PORT = '3000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    credentialsId: 'github-token', 
                    url: 'https://github.com/engrmalakkashif/nodejs.app.git'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=NodeJS-web \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONAR_HOST_URL}
                    '''
                }
            }
        }
        
        stage('Quality Gate Check') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Deploy to Docker Server') {
            steps {
                sh '''
                    scp -r -o StrictHostKeyChecking=no \
                        ./Dockerfile \
                        ./package.json \
                        ./package-lock.json \
                        ./*.js \
                        ./src \
                        ./public \
                        ${DOCKER_SERVER}:~/website/
                '''
                
                sshagent(['docker-server-credentials']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ${DOCKER_SERVER} << 'EOF'
                            cd /home/ubuntu/website
                            docker build -t ${APP_NAME} .
                            docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
                            docker run -d -p ${DOCKER_PORT}:${APP_PORT} \
                                --name=${CONTAINER_NAME} ${APP_NAME}
                            docker ps
                            curl http://localhost:${DOCKER_PORT}
                        EOF
                    '''
                }
            }
        }
    }
    
    post {
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Pipeline succeeded! Application deployed successfully!'
        }
    }
}
