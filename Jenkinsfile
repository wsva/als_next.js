pipeline {
  agent {
    kubernetes {
      yaml '''
      apiVersion: v1
      kind: Pod
      metadata:
        name: delete-als-node
        namespace: devops-tools
      spec:
        template:
          metadata:
            labels:
              app: delete-als-node
          spec:
            serviceAccountName: jenkins-admin
            containers:
              - name: kubectl
                image: bitnami/kubectl:latest
                command: 
                  - cat
                  - "3600"
                tty: true
      '''
    }
  }
  stages {
    stage('Delete Pod') {
      steps {
        sh 'kubectl delete pod -n default -l app=als-node'
      }
    }
  }
}