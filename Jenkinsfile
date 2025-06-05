podTemplate(label: 'mypod', containers: [
    containerTemplate(name: 'jnlp', image: 'jenkins/inbound-agent'),
    containerTemplate(name: 'kubectl', image: 'bitnami/kubectl', command: 'cat', ttyEnabled: true)
]) {
    node('mypod') {
        container('kubectl') {
            sh 'kubectl delete pod -n default -l app=als-node'
        }
    }
}