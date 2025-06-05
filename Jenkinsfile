/**
 * node('restart-als-node') -> pod with label: restart-als-node
 *
 * runAsUser: "1000"
 * cp: cannot create regular file '/home/jenkins/agent/workspace/als_node@tmp/durable-fbc37cf7/script.sh.copy': Permission denied
 */

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
      sh 'kubectl delete pod -n default -l app=als-node'
    }
  }
}