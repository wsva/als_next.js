podTemplate {
    node('kubectl') {
        container('kubectl') {
            sh 'kubectl delete pod -n default -l app=als-node'
        }
    }
}