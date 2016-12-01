<?php
	trait Selects {
        public function cargar_traindata($post)
        {
            $query = $this->db->prepare("
                select data, charcode
                from TrainData
            ");
            
            $query->execute();
            $data = $query->fetchAll();
            $ret = array();

            foreach ($data as $d)
                $ret[] = array(
                    "data" => $d["data"],
                    "charcode" => $d["charcode"]
                );

            return json_encode($ret);
        }
	}
?>