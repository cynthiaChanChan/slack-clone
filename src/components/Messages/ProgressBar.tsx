import React from "react";
import { Progress } from "semantic-ui-react";

type ProgressBarProps = {
    uploadState: string;
    percentUploaded: number;
};

const ProgressBar = ({ uploadState, percentUploaded }: ProgressBarProps) =>
    uploadState === "uploading" ? (
        <Progress
            className="progress-bar"
            percent={percentUploaded}
            progress
            indicating
            size="medium"
            inverted
        />
    ) : null;

export default ProgressBar;
