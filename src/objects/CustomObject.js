class CustomObject extends RenderObject {
    constructor(glContext, object) {
        super(glContext, object);
        this.type = "Custom";
        this.model = { ...object.model,
            ...this.model};
    }

    setup() {
        this.centroid = calculateCentroid(this.model.vertices);
        this.lightingShader();
        this.scale(this.initialTransform.scale);
        this.translate(this.initialTransform.position);
        this.model.rotation = this.initialTransform.rotation;
        this.initBuffers();
    }
}
