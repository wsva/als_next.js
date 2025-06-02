pipeline {
  agent any
  stages {
    stage('Delete Pod') {
      steps {
        sh 'kubectl delete pod -n default -l app=als-node'
      }
    }
  }
}