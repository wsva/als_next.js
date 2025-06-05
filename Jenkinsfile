podTemplate(
  label: 'restart-als-node',
  serviceAccount: 'jenkins-admin',
  containers: [
    containerTemplate(name: 'jnlp', image: 'jenkins/inbound-agent'),
    containerTemplate(
      name: 'kubectl', 
      image: 'bitnami/kubectl:1.32', 
      command: 'cat', 
      ttyEnabled: true,
      runAsUser: "1000"
    )
  ]
) {
  node('restart-als-node') {
    container('kubectl') {
      sh 'echo "hello!!!"'
      sh 'kubectl delete pod -n default -l app=als-node'
    }
  }
}