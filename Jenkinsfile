podTemplate(
    label: 'restart-als-node',
    serviceAccount: 'jenkins-admin',
    containers: [
        containerTemplate(name: 'jnlp', image: 'jenkins/inbound-agent'),
        containerTemplate(name: 'kubectl', image: 'bitnami/kubectl:1.32', command: 'cat', ttyEnabled: true)
    ]
) {
    node('restart-als-node') {
        container('kubectl') {
            sh -c 'kubectl delete pod -n default -l app=als-node'
        }
    }
}