/*
 *  Copyright (C) 2018, Throughwave (Thailand) Co., Ltd.
 *
 *  This file is main file of nogdb-server, the NogDB server (service).
 *
 *  nogdb-server is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

#include <getopt.h>
#include <iostream>
#include <server_http.hpp>
#include <nogdb/nogdb.h>

#include "http_response.hpp"

using namespace std;
using namespace nogdb;
using HttpServer = SimpleWeb::Server<SimpleWeb::HTTP>;

struct Option {
    Option(int argc, char *argv[]);

    string dbPath;
    string address{""};
    unsigned short port{8090};
    size_t threadPool{1};
};

static string Usage{" [-h] [-i ip_address] [-p port] [-t thread_pool_size] <database>"};

Option::Option(int argc, char *argv[]) {
    static struct option opts[] = {
        { "ip-address", required_argument, NULL, 'i' },
        { "port", required_argument, NULL, 'p' },
        { "thread", required_argument, NULL, 't' },
        { NULL, 0, NULL, 0 }
    };

    int ch;

    while ((ch = getopt_long(argc, argv, "hi:p:t:", opts, NULL)) != -1) {
        switch (ch) {
            case 'h':
                cout << "Usage :" << argv[0] << Usage;
                exit(0);
            case 'i':
                this->address = optarg;
                break;
            case 'p':
                try {
                    this->port = stoi(optarg);
                } catch (const invalid_argument &e) {
                    throw std::invalid_argument(string("Invalid option '" + to_string(ch) + "' arguments: " + optarg));
                }
                break;
            case 't':
                try {
                    this->threadPool = stoull(optarg);
                } catch (const invalid_argument &e) {
                    throw std::invalid_argument(string("Invalid option '" + to_string(ch) + "' arguments: " + optarg));
                }
                break;
            default:
                /* getopt_long already printed an error message. */
                throw std::invalid_argument(string("Unknown option: ") + optarg);
        }
    }

    if (optind < argc) {
        this->dbPath = argv[optind];
    } else {
        throw std::invalid_argument("Invalid arguments <database>");
    }
}

int main(int argc, char * argv[]) {
    try {
        Option opt = Option(argc, argv);

        Context ctx{opt.dbPath};

        HttpServer httpSv{};
        httpSv.config.address = opt.address;
        httpSv.config.port = opt.port;
        httpSv.config.thread_pool_size = opt.threadPool;

        server::setupHttpResponse(httpSv, ctx);
        httpSv.start();
    } catch (const nogdb::Error &e) {
        cerr << "NogDB Error " << e.code() << ": " << e.what() << endl;
    } catch (const exception &e) {
        cerr << e.what() << endl;
    }


    return 0;
}

