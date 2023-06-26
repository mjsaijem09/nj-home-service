pipeline{
    agent none
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 7, unit: 'DAYS')
        timestamps()
}

    environment {
       REGION="ap-southeast-2"
       ECR_REPO="448447674442.dkr.ecr.ap-southeast-2.amazonaws.com/frontend-home.bookus.com"
       AWS_ECS_SERVICE = "dev-thebookus-cluster-FrontendcustomerpwaService-TN5sdufkV0gq"
       LB_SERVICE = "dev-thebookus-cluster-LoadbalancerService-ZzOMFyEYe4U1"
       AWS_ECS_TASK_DEFINITION = 'dev-thebookus-cluster-frontend-customerpwa'
       AWS_ECS_COMPATIBILITY = 'FARGATE'
       AWS_ECS_NETWORK_MODE = 'awsvpc'
       AWS_ECS_CPU = '256'
       AWS_ECS_MEMORY = '512'
       AWS_ECS_CLUSTER = 'dev-thebookus-cluster'
       AWS_ECS_TASK_DEFINITION_PATH = 'taskdef.json'

   }    
    stages{
        stage("ECR login"){
            agent {label 'ec2-fleet'}
            steps{
                echo "----------------------------------------- Login to AWS ECR ---------------------------------------------------"
                sh "sudo chmod 777 /var/run/docker.sock"
                sh 'aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin 448447674442.dkr.ecr.${REGION}.amazonaws.com'
            }
        }
        stage("Build and push Docker image"){
            agent {label 'ec2-fleet'}
            steps{
                echo "------------------------------------------ Build and push docker image --------------------------------------------------"
                sh "sudo chmod 777 /var/run/docker.sock"
                script {
                sh("docker pull node")
                sh("docker build -t ${env.ECR_REPO}:1.0.${env.BUILD_ID} -t ${env.ECR_REPO}:latest -f Dockerfile.dev .")
                docker.withRegistry("https://448447674442.dkr.ecr.ap-southeast-2.amazonaws.com", "ecr:${env.REGION}:aws-jenkins-admin"){
                sh("docker push ${env.ECR_REPO} --all-tags")}
                }
            }
        }
        stage("Deploy to ECS"){
            agent {label 'ec2-fleet'}
            steps {
                script {
                sh("sed -e \"s;%BUILD_NUMBER%;${env.BUILD_ID};g\" -e \"s;%REPOSITORY_URI%;${env.ECR_REPO};g\" ${env.AWS_ECS_TASK_DEFINITION_PATH} >> taskdef2.json")
                sh("aws ecs register-task-definition --region ${env.REGION} --family ${env.AWS_ECS_TASK_DEFINITION} --requires-compatibilities ${env.AWS_ECS_COMPATIBILITY} --network-mode ${env.AWS_ECS_NETWORK_MODE} --cli-input-json file://taskdef2.json --query 'taskDefinition.[taskDefinitionArn, containerDefinitions[*].[name,image]]'")
                def taskRevision = sh(script: "aws ecs describe-task-definition  --region ${env.REGION} --task-definition ${env.AWS_ECS_TASK_DEFINITION} | egrep \"revision\" | tr \"/\" \" \" | awk '{print \$2}' | sed 's/\"\$//'", returnStdout: true)
                def deregisterRevision = taskRevision.toInteger() - 5
                sh("aws ecs deregister-task-definition  --region ${env.REGION} --task-definition ${env.AWS_ECS_TASK_DEFINITION}:${deregisterRevision} --query 'taskDefinition.[taskDefinitionArn, containerDefinitions[*].[name,image], status]'")
                sh("aws ecs update-service --query 'service.[taskDefinition]' --cluster ${env.AWS_ECS_CLUSTER}  --region ${env.REGION} --service ${env.AWS_ECS_SERVICE} --task-definition ${env.AWS_ECS_TASK_DEFINITION}:${taskRevision}")
                }
                
            }
    }
    stage("Deploy to Prod?"){
            steps {
                input(message:'Do you want to deploy to prod?', ok: 'Yes')
                
            }
    }
}
}