node {

    stage('clone git repo'){
        bat "if exist jmeter-task rmdir /s /q jmeter-task"
        bat "git clone https://github.com/Kiranmoy/jmeter-task.git"
    } 

    stage("configure") {
        bat "mkdir $BUILD_NUMBER"
    } 

    stage('run test'){
        def SCRIPT_PATH="jmeter-task\\load-model-test-v0.jmx"
        def RESULT_PATH="$WORKSPACE\\$BUILD_NUMBER\\result.csv"
        def LOG_PATH="$WORKSPACE\\$BUILD_NUMBER\\jmeterLog.txt"
        def HTML_REPORT_PATH="$WORKSPACE\\$BUILD_NUMBER\\htmlReport"

        bat "jmeter -Jthreads=5 -Jrampup-period=5 -Jloop-count=-1 -Jduration=1800 -Jjmeter.save.saveservice.output_format=csv -n -t ${SCRIPT_PATH} -l ${RESULT_PATH} -j ${LOG_PATH} -e -o ${HTML_REPORT_PATH}"
    }
 

    stage('publish results'){        
        archiveArtifacts artifacts: "$BUILD_NUMBER\\result.csv, $BUILD_NUMBER\\jmeterLog.txt, $BUILD_NUMBER\\htmlReport\\index.html"
        publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: "$BUILD_NUMBER\\htmlReport", reportFiles: "index.html", reportName: 'Jmeter Load Test Performance Report', reportTitles: "", useWrapperFileDirectly: true])
    } 

}
