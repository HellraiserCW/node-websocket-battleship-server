import path from 'path';

export default {
        target: 'node',
        mode: 'production',
        entry: path.resolve(__dirname, 'src', 'ws_server', 'index.ts'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            clean: true,
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        externals: {
            bufferutil: 'bufferutil',
            'utf-8-validate': 'utf-8-validate',
        }
};
