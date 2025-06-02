pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: kubectl-agent
spec:
  serviceAccountName: jenkins-admin
  containers:
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - cat
    tty: true
"""
    }
  }

  stages {
    stage('Delete Pod') {
      steps {
        container('kubectl') {
          sh 'kubectl delete pod -n default -l app=als-node'
        }
      }
    }
  }
}
