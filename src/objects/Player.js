class Player extends RenderObject {
    constructor(glContext, object) {
        super(glContext, object);
        this.type = "player";
        this.rolling = 0;

        this.model = { ...this.model,
            vertices: [
                0.5, 0.0, 0.0,
                0.5, 1.0, 0.0,
                1.0, 1.0, 0.0,
                1.0, 0.0, 0.0,

                0.5, 0.0, 0.5,
                0.5, 1.0, 0.5,
                1.0, 1.0, 0.5,
                1.0, 0.0, 0.5,

                0.5, 1.0, 0.5,
                0.5, 1.0, 0.0,
                1.0, 1.0, 0.0,
                1.0, 1.0, 0.5,

                0.5, 0.0, 0.5,
                1.0, 0.0, 0.5,
                1.0, 0.0, 0.0,
                0.5, 0.0, 0.0,

                1.0, 0.0, 0.5,
                1.0, 0.0, 0.0,
                1.0, 1.0, 0.5,
                1.0, 1.0, 0.0,

                0.5, 0.0, 0.5,
                0.5, 0.0, 0.0,
                0.5, 1.0, 0.5,
                0.5, 1.0, 0.0
            ],
            triangles: [
                //front face
                2, 0, 1, 3, 0, 2,
                //backface
                5, 4, 6, 6, 4, 7,
                //top face
                10, 9, 8, 10, 8, 11,
                //bottom face
                13, 12, 14, 14, 12, 15,
                //side
                18, 16, 17, 18, 17, 19,
                //side
                22, 21, 20, 23, 21, 22,
            ],
            uvs: [
                // 3/8, 1/6, // Different color for each side
                // 3/8, 1/6,
                // 3/8, 1/6,
                // 3/8, 1/6,
                //
                // 2/8, 3/6,
                // 2/8, 3/6,
                // 2/8, 3/6,
                // 2/8, 3/6,
                //
                // 3/8, 3/6,
                // 3/8, 3/6,
                // 3/8, 3/6,
                // 3/8, 3/6,
                //
                // 3/8, 5/6,
                // 3/8, 5/6,
                // 3/8, 5/6,
                // 3/8, 5/6,
                //
                // 5/8, 3/6,
                // 5/8, 3/6,
                // 5/8, 3/6,
                // 5/8, 3/6,
                //
                // 7/8, 3/6,
                // 7/8, 3/6,
                // 7/8, 3/6,
                // 7/8, 3/6,
                3/8, 1/6, // Same color for opposite sides
                3/8, 1/6,
                3/8, 1/6,
                3/8, 1/6,

                3/8, 1/6,
                3/8, 1/6,
                3/8, 1/6,
                3/8, 1/6,

                3/8, 3/6,
                3/8, 3/6,
                3/8, 3/6,
                3/8, 3/6,

                3/8, 3/6,
                3/8, 3/6,
                3/8, 3/6,
                3/8, 3/6,

                7/8, 3/6,
                7/8, 3/6,
                7/8, 3/6,
                7/8, 3/6,

                7/8, 3/6,
                7/8, 3/6,
                7/8, 3/6,
                7/8, 3/6,
            ],
            normals: [
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,

                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,

                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,

                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,

                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,

                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0
            ],
            bitangents: [
                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
                0, -1, 0, // Front

                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
                0, -1, 0, // Back

                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
                0, -1, 0, // Right

                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
                0, -1, 0, // Left

                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1, // Top

                0, 0, -1,
                0, 0, -1,
                0, 0, -1,
                0, 0, -1, // Bot
            ],
            colours: [
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,

                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,

                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,

                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,

                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
            ]
        };
        this.original = {
            position: vec3.copy([], object.position),
            rotation: [...object.rotation],
        };
    }

    rotate(axis, angle) {
        let axisVector;
        if (axis === 'x') {
            axisVector = vec3.fromValues(1, 0, 0)
        } else if (axis == 'y') {
            axisVector = vec3.fromValues(0, 1, 0)
        } else if (axis == 'z') {
            axisVector = vec3.fromValues(0, 0, 1)
        }
        let worldToLocalRotation = mat4.transpose([], this.model.rotation)
        vec3.transformMat4(axisVector, axisVector, worldToLocalRotation);
        mat4.rotate(this.model.rotation, this.model.rotation, angle, axisVector);
    }

    async setup() {
        this.centroid = calculateCentroid(this.model.vertices);
        this.lightingShader();
        this.scale(this.initialTransform.scale);
        this.translate(this.initialTransform.position);
        this.model.rotation = this.initialTransform.rotation;
        this.initBuffers();
    }
}
