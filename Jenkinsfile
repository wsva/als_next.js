podTemplate {
    node('Built-In Node') {
        container('kubectl') {
            sh 'kubectl delete pod -n default -l app=als-node'
        }
    }
}