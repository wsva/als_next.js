pipeline {
  agent any
  stages {
    stage('Delete Pod') {
      steps {
        sh 'echo $PATH'
        sh '/usr/bin/kubectl delete pod -n default -l app=als-node'
      }
    }
  }
}
