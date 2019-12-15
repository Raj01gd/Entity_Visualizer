using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Entity_Visualiser.Models
{
    public class Columns
    {
        public string name { get; set; }
        public string dataType { get; set; }
        public string length { get; set; }
        public string isNullable { get; set; }
        public string isIdentity { get; set; }
    }
}