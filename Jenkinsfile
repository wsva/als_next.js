podTemplate {
    node('server1.alansworkshop.site') {
        container('kubectl') {
            sh 'kubectl delete pod -n default -l app=als-node'
        }
    }
}