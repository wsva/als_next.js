pipeline {
  agent any
  stages {
    stage('Delete Pod') {
      steps {
        withKubeConfig([serverUrl: 'https://66.29.131.13:6443',
                    contextName: 'kubernetes-admin@kubernetes',
                    clusterName: 'kubernetes',
                    namespace: 'default'
                    ]) {
          sh 'echo $JENKINS_HOME'
          sh '$JENKINS_HOME/kubectl delete pod -n default -l app=als-node'
        }
      }
    }
  }
}
