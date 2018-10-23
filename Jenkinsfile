node {
    stage('VCS') {
        checkout scm
    }

    stage('Setup'){
        nodejs('node8') {
            sh 'npm i -g @angular/cli@latest'
            sh 'npm i'
        }
    }

    stage('Build') {
        nodejs('node8') {
            sh 'npm run-script build'
        }
    }

    stage('Build Image') {
        sh '''
            rm -rf node_modules
            oc start-build booze-o-meter-fe --from-dir=. --follow
        '''
    }
}
