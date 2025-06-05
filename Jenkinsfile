podTemplate(
    label: 'restart-als-node',
    serviceAccount: 'jenkins-admin',
    containers: [
        containerTemplate(name: 'jnlp', image: 'jenkins/inbound-agent'),
        containerTemplate(name: 'kubectl', image: 'bitnami/kubectl', command: 'cat', ttyEnabled: true)
    ]
) {
    node('restart-als-node') {
        container('kubectl') {
            sh 'kubectl delete pod -n default -l app=als-node'
        }
    }
}