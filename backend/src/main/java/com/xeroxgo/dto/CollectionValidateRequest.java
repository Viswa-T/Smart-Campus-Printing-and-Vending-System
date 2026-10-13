package com.xeroxgo.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CollectionValidateRequest {

    @NotBlank(message = "Collection code is required")
    private String code;

    private String machineCode;

    public CollectionValidateRequest() {}

    public CollectionValidateRequest(String code, String machineCode) {
        this.code = code;
        this.machineCode = machineCode;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getMachineCode() { return machineCode; }
    public void setMachineCode(String machineCode) { this.machineCode = machineCode; }
}
