node {

    stage('clone git repo'){
        bat "if exist jmeter-task rmdir /s /q jmeter-task"
        bat "git clone https://github.com/Kiranmoy/jmeter-task.git"
    } 

    stage("configure") {
        bat "mkdir $BUILD_NUMBER"
    } 

    stage('run test'){
        bat "jmeter -J jmeter.save.saveservice.output_format=csv -n -t jmeter-task\\load-model-test-v0.jmx -l $WORKSPACE\\$BUILD_NUMBER\\result.csv -j $WORKSPACE\\$BUILD_NUMBER\\jmeterLog.txt -e -o $WORKSPACE\\$BUILD_NUMBER\\htmlReport"
    }
 

    stage('publish results'){
        archiveArtifacts artifacts: "$BUILD_NUMBER\\result.csv, $BUILD_NUMBER\\jmeterLog.txt, $BUILD_NUMBER\\htmlReport\\index.html"
        publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: "$BUILD_NUMBER\\htmlReport", reportFiles: "index.html", reportName: 'Jmeter Load Test Performance Report', reportTitles: "", useWrapperFileDirectly: true])
    } 

}
